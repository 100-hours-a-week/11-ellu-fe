// params로 아이디 불러오기

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div>프로젝트 {id} 페이지</div>;
}
