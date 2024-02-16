import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useCrypto } from "../context/crypto-context";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioChart() {
  const { assets, loading } = useCrypto();
  const data = {
    labels: assets.map((asset) => asset.name),
    datasets: [
      {
        label: "$",
        data: assets.map((asset) => asset.totalAmount),
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
      },
    ],
  };
  return (
    <div
      style={{
        display: "flex",
        height: 400,
        maxHeight: 400,
        justifyContent: "center",
        opacity: loading ? 0 : 1,
        transition: "opacity 0.5s",
        transitionDelay: "1.5s",
        ease: "ease-in-out",
      }}
    >
      {!assets.length ? (
        <div
          style={{
            backgroundColor: "rgba(255, 159, 64, 1)",
            borderRadius: "100%",
            height: "100%",
            width: 400,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "3px solid white",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          No assets in your portfolio
        </div>
      ) : (
        <Pie data={data} />
      )}
    </div>
  );
}
