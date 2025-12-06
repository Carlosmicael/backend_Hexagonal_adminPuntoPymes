import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { FirebaseUserRepository, Jornada } from '../../user/infrastructure/repositories/user.repository.firebase';
import { FirebaseCompanyRepository } from '../../user/infrastructure/repositories/company.repository.firebase';
import { FirebaseAttendanceRepository } from '../infrastructure/repositories/attendance.repository.firebase';
import moment from 'moment-timezone';

@Injectable()
export class RegisterAttendanceUseCase {
    constructor(
        private readonly userRepo: FirebaseUserRepository,
        private readonly companyRepo: FirebaseCompanyRepository,
        private readonly attendanceRepo: FirebaseAttendanceRepository,
    ) { }

    async execute(companyId: string, employeeId: string, userLat: number, userLng: number) {

        // 1. Obtener datos del empleado (para saber su branchId)
        const employee = await this.userRepo.findById(employeeId); // Asumiendo que findById busca por UID
        if (!employee) throw new BadRequestException('Empleado no encontrado');

        if (!employee.branchId) throw new ForbiddenException('El empleado no tiene una sucursal asignada');

        // 2. Obtener datos de la sucursal (Coordenadas y Rango)
        const branch = await this.companyRepo.getBranchById(companyId, employee.branchId);
        if (!branch) throw new BadRequestException('Sucursal no encontrada');

        // 3. VALIDACIÓN GEOVALLA (Matemática Haversine)
        const distancia = this.getDistanceFromLatLonInMeters(userLat, userLng, branch.latitud, branch.longitud);
        const rangoPermitido = branch.rangoGeografico || 100; // Default 100 metros

        if (distancia > rangoPermitido) {
            throw new ForbiddenException(`Estás fuera de rango. Distancia: ${distancia.toFixed(1)}m. Máximo: ${rangoPermitido}m`);
        }

        // 4. Obtener la jornada laboral vigente
        const jornada: Jornada | null = await this.userRepo.getJornadaVigente(companyId, employeeId);

        if (!jornada) {
            throw new NotFoundException('No se ha encontrado una jornada laboral activa para este empleado.');
        }

        const now = moment().tz('America/Guayaquil');

        // 4.5. VALIDACIÓN CRUCIAL DE DÍA LABORAL
        // moment().day() retorna un número (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
        const currentDayNumeric = now.day();

        if (!jornada.dias || !jornada.dias.includes(currentDayNumeric)) { // <-- 2. Validar que el día esté en el array
            const dayName = now.locale('es').format('dddd');
            throw new ForbiddenException(`Hoy, ${dayName}, no es un día laboral según su jornada asignada.`);
        }

        // 5. Consultar el estado del día (Asistencia anterior)
        const todayRecords = await this.attendanceRepo.getTodayRecords(companyId, employeeId);

        let tipoRegistro: 'entrada' | 'salida';
        let estado: string = 'válido';

        // Determinar si es entrada o salida
        const hasEntry = todayRecords.some(r => r.tipo === 'entrada');
        const hasExit = todayRecords.some(r => r.tipo === 'salida');

        if (!hasEntry) {
            tipoRegistro = 'entrada';
        } else if (hasEntry && !hasExit) {
            tipoRegistro = 'salida';
        } else {
            throw new ForbiddenException('Ya se ha registrado la entrada y la salida para el día de hoy.');
        }

        // 6. VALIDACIÓN DE HORA (La lógica interna es correcta)

        if (tipoRegistro === 'entrada') {
            // A. Hora de Entrada Esperada
            const horaEntradaEsperada = moment.tz(
                `${now.format('YYYY-MM-DD')} ${jornada.horaEntrada}`,
                'YYYY-MM-DD HH:mm:ss',
                'America/Guayaquil'
            );

            // B. Hora Límite de Tolerancia (Entrada + Tolerancia)
            const horaLimite = horaEntradaEsperada.clone().add(jornada.tolerancia, 'minutes');

            if (now.isBefore(horaEntradaEsperada)) {
                // Llegó antes de la hora (Válido temprano)
                estado = 'válido';
            } else if (now.isBetween(horaEntradaEsperada, horaLimite, 'minutes', '[]')) {
                // Llegó dentro del rango de tolerancia (Atrazo leve)
                estado = 'atraso';
            } else if (now.isAfter(horaLimite)) {
                // Llegó muy tarde (Fuera de rango)
                estado = 'fuera de rango';
            }
        } else if (tipoRegistro === 'salida') {
            // A. Hora de Salida Esperada
            const horaSalidaEsperada = moment.tz(
                `${now.format('YYYY-MM-DD')} ${jornada.horaSalida}`,
                'YYYY-MM-DD HH:mm:ss',
                'America/Guayaquil'
            );

            // B. Salida Anticipada
            // Comparar: Si la hora actual es anterior a la hora de salida esperada
            if (now.isBefore(horaSalidaEsperada)) {
                estado = 'salida anticipada';
            }
            // Si no es 'salida anticipada', mantiene el estado inicial 'válido'.
        }

        // 7. Preparar Datos para Guardar (Usando el nuevo estado)
        const nuevoRegistro = {
            fecha: now.format('YYYY-MM-DD'),
            hora: now.format('HH:mm:ss'),
            tipo: tipoRegistro,
            latitud: userLat,
            longitud: userLng,
            dentroDelRango: true,
            // Estado dinámico
            estado: estado,
            deviceInfo: 'App',
            branchId: employee.branchId
        };

        // 8. Guardar en BD (Paso 6 anterior)
        await this.attendanceRepo.create(companyId, employeeId, nuevoRegistro);

        // -----------------------------------------------------------------
        // ✅ DEVOLVER EL REGISTRO CREADO
        // -----------------------------------------------------------------
        return {
            ...nuevoRegistro, // Devuelve todos los datos que Dart necesita
            message: `Registro de ${tipoRegistro} exitoso`, // Mensaje amigable para el frontend
            statusCode: 201, // Ayuda a NestJS a establecer el código correcto
        };
    }

    // Helper para calcular distancia
    private getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371e3; // Radio de la tierra en metros
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distancia en metros
    }

    private deg2rad(deg: number) {
        return deg * (Math.PI / 180);
    }
}