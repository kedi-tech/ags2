// [build] library: 'shadcn'
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

const meta = {
  title: "ui/Avatar",
  component: Avatar,
  tASG: ["autodocs"],
  argTypes: {},
};

export default meta;

export const Base = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
  args: {},
};
