"use client";

import { Children, ReactElement, ReactNode, useEffect, useState } from "react";

const Sheet = ({ children }: { children: ReactElement[] }) => {
  let _button, _body;

  Children.forEach(children, (child: ReactElement) => {
    if (child.type === SheetButton) {
      return (_button = child);
    }
    if (child.type === SheetBody) {
      return (_body = child);
    }
  });

  if (!_button) _button = <SheetButton>Open Sheet</SheetButton>;
  if (!_body) _body = <SheetBody />;

  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="sheet-button" onClick={() => setOpen((prev) => !prev)}>
        {_button}
      </button>
      <div
        className={`sheet-body ${
          open ? "sheet-body-open" : "sheet-body-close"
        }`}
      >
        <div className="black-background" onClick={() => setOpen(false)} />
        <div className="sheet-content">{_body}</div>
      </div>
    </>
  );
};

const SheetButton = ({ children }: { children?: ReactNode }) => <>{children}</>;

const SheetBody = ({ children }: { children?: ReactNode }) => <>{children}</>;

Sheet.Button = SheetButton;
Sheet.Body = SheetBody;

export default Sheet;
