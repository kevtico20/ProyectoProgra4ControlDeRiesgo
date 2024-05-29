import React, { use, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useUser } from "../../../../lib/userContext";
import { FormProgressResponse } from "../../../index";

const FormProgressChart = () => {
  const { user } = useUser();
  const [formProgress, setFormProgress] = useState<FormProgressResponse | null>(
    null
  );

  useEffect(() => {
    if (user) {
      const fetchFormProgress = async () => {
        try {
          const response = await fetch(
            `/api/dashboard/employee/getFormProgress?id=${user.usu_id}`
          );
          const data: FormProgressResponse = await response.json();
          setFormProgress(data);
        } catch (error) {
          console.error("Error fetching form progress data:", error);
        }
      };
      fetchFormProgress();
    }
  }, [user]);

  const data = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        label: "Form Progress",
        data: [formProgress?.answeredQuestions, formProgress?.totalQuestions],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return (
    <div className="my-4 w-full md:w-2/5 md:flex md:justify-between bg-background-3 shadow-lg rounded-lg p-5 text-white">
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-3">
          {formProgress?.form_name}
        </h3>
        <Pie data={data} />
      </div>
    </div>
  );
};

export default FormProgressChart;