export function Parser(characterId: number, data: any) {
  console.log(data);
  const name = data[characterId]?.name;

  return {
    id: characterId,
    name: name,
  };
}
