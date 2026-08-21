import BuildLoader from "./build-loader";

export default async function BuildPage(props: PageProps<"/build">) {
  const { uid } = await props.searchParams;
  const normalizedUid = typeof uid === "string" ? uid : "";
  return <BuildLoader uid={normalizedUid} />;
}
