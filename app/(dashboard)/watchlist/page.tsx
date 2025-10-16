import TopCoins from '@/components/topcointable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function WatchlistPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <TopCoins usingCoinList={true} />
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
