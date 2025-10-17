import { TopCoins } from '@/components/topcointable';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
// import { GainersLosers } from '@/components/gainersloserstable';

// TODO
// deployment
// search coins

export default async function ProductsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Coins</CardTitle>
        <TopCoins />
        {/* <GainersLosers vs_currency="usd" duration="24h"></GainersLosers> */}
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
