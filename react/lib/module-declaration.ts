import type { JBPinInputWebComponent } from 'jb-pin-input';

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'jb-pin-input': JBPinInputType;
    }
    interface JBPinInputType extends React.DetailedHTMLProps<React.HTMLAttributes<JBPinInputWebComponent>, JBPinInputWebComponent> {
      class?: string,
      label?: string,
      name?: string,
      message?: string,
      value?: string,
      initialValue?: string,
      // ref:React.RefObject<JBDateInputWebComponent>,
    }
  }
}
