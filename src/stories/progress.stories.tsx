// [build] library: 'shadcn'
import { Progress } from "../components/ui/progress";

const meta = {
  title: "ui/Progress",
  component: Progress,
  tASG: ["autodocs"],
  argTypes: {},
};
export default meta;

export const Base = {
  render: () => <Progress value={33} />,
  args: {},
};
