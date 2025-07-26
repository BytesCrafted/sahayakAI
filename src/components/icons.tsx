export function Logotype(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 20"
      aria-label="SahayakAI"
      {...props}
    >
      <text
        x="0"
        y="15"
        fontFamily="'PT Sans', sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        SahayakAI
      </text>
    </svg>
  );
}
