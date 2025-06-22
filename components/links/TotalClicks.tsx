import { FC } from "react";
import { Card } from "../ui/card";
import { LinkType } from "@/types";

interface TotalClicksProps {
  link: LinkType;
}

const TotalClicks: FC<TotalClicksProps> = ({}) => {
  return (
    <Card className="w-full">
      <Card.Header
        title="Total Clicks"
        description={`From creation date till now`}
      />
      <Card.Content>
        <p className="text-2xl font-bold">1000</p>
      </Card.Content>
    </Card>
  );
};

export default TotalClicks;
