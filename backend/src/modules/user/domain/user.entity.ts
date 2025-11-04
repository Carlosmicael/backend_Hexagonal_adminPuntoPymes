export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
  ) {}

  rename(newName: string) {
    this.name = newName;
  }
}
