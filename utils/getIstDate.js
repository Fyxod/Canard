export default function getIstDate() {
  const istDate = new Date(Date.now() + 330 * 60 * 1000);
  return istDate;
}

console.log(getIstDate());
