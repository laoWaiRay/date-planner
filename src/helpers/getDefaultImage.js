export function getDefaultImage(category) {
  switch (category) {
    case "adventurous":
      return "/src/assets/default_images/adventurous.jpg";
    case "indoor":
      return "/src/assets/default_images/indoor.jpg";
    case "relaxing":
      return "/src/assets/default_images/relaxing.jpg";
    case "romantic":
      return "/src/assets/default_images/romantic.jpg";
    case "stayathome":
      return "/src/assets/default_images/stayAtHome.jpg";
    default:
      return "/src/assets/default_images/indoor.jpg";
  }
}
