export interface UseCase<Request = void, Response = void> {
  execute(data: Request): Promise<Response>
}
