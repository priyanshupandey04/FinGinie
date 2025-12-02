"use client";

import { Plan } from "@/lib/types";
import React, { useEffect, useState } from "react";

type Props = {
  id: number;
};

const Dashboard = (props: Props) => {
  const { id } = props;

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllPlans = async () => {
      const response = await fetch(`/api/getAllPlans?id=${id}`);
      const data = await response.json();
      console.log("data = ", data);

      if (data.plans.length === 0) {
        setPlans([]);
      } else {
        setPlans(data.plans);
      }

      setIsFetching(false);
    };
    fetchAllPlans();
  }, []);

  if (isFetching) return <div>Loading...</div>;

  if (plans.length === 0) return <div>No Plans</div>;

  return <div className="text-white">Dashboard</div>;
};

export default Dashboard;
