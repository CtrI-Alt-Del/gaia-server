export interface DatetimeProvider {
  getStartOf(date: Date): Date
  getEndOf(date: Date): Date
}
