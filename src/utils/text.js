// funcion global para capitalize todas las palabras de  un texto, en especial direcciones y nombres etc

export function capitalizeAll(text = "") {
  return text
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}