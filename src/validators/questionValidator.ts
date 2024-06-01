import { checkSchema } from "express-validator";

export const QuestionValidation = checkSchema({
    name: {
        errorMessage: "Enter the Question",
        trim: true,
        notEmpty: true,
        isLength: {
            options: {
                min: 1,
            },
        },
    },
});
