export class AppException extends Error {
	protected title: string;
	protected errorMessage: string;
	constructor(message: string, title?: string) {
		super(message);
		this.errorMessage = message;
		this.title = title ?? "App Exception";
	}
	public getTitle(): string {
		return this.title;
	}
	public getErrorMessage(): string {
		return this.errorMessage;
	}
}
