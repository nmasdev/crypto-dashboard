import PriceChart from "@/components/pricechart";

interface CoinPageProps {
  params: Promise<{
    coin: string;
  }>;
}

export default async function CoinPage({ params }: CoinPageProps ) {
  const { coin } = await params;
  return (
    <PriceChart coin={coin} days={7}></PriceChart>
  );
}
