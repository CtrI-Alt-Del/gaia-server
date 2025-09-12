export class AppError extends Error {
  readonly title: string
  readonly message: string

  constructor(message: string, title?: string) {
    super(message)
    this.message = message
    this.title = title ?? 'App Exception'
  }
}
