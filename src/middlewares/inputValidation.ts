import { check, validationResult } from 'express-validator';

export const isNonEmptyString = (field: string, isStringMessage: string, notEmptyMessage: string) => {
  return check(field).exists()
  .isString().withMessage(isStringMessage)
  .not().isEmpty().withMessage(notEmptyMessage)
  .trim().escape()
}


export const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  return next();
}