import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsExclusiveWith(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isExclusiveWith',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          
          const hasValue = value !== undefined && value !== null && value !== '';
          const hasRelated = relatedValue !== undefined && relatedValue !== null && relatedValue !== '';
          
          // Exatamente um deve estar preenchido (XOR)
          return (hasValue && !hasRelated) || (!hasValue && hasRelated);
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `Must provide either ${args.property} or ${relatedPropertyName}, but not both`;
        },
      },
    });
  };
}