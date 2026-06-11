
import { Clock as ClockIcon } from "lucide-react";

export const Clock = ({ className, ...props }: React.ComponentProps<typeof ClockIcon>) => {
  return <ClockIcon className={className} {...props} />;
};

export default Clock;
