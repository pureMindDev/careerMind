/**
 * Validates req[source] against a Zod schema and replaces it with the parsed
 * (and therefore trimmed/coerced/defaulted) value. Validation failures are
 * passed to the global error handler, which turns ZodErrors into a 400.
 */
export function validate(schema, source = "body") {
  return (req, res, next) => {
    try {
      req[source] = schema.parse(req[source] ?? {});
      next();
    } catch (err) {
      next(err);
    }
  };
}
