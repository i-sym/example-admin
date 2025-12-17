export class ConverterService {
    private static instance: ConverterService;
    private constructor() { }
    public static getInstance(): ConverterService {
        if (!ConverterService.instance) {
            ConverterService.instance = new ConverterService();
        }
        return ConverterService.instance;
    }

}