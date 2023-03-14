export const isNotEmpty = (input: string): boolean | string => {
  if (input.length > 0) return true;

  return "Input cannot be empty, please try again.";
};
