export function Parser(characterId: number, data: any) {
  const name = data[characterId]?.name;

  return {
    id: characterId,
    name: name,
  };
}
