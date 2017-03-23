export class FieldsModel {
    
    public value: string;
    public defaultValue: string;
    public label: string;
    public updatable: boolean = true;
    public name: string;
    public type: string = "Text";
    public format: string;
    public mandatory: boolean = false;

    constructor() { }
}