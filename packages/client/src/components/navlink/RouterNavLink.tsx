import { useNavigate, NavigateOptions } from "react-router-dom";
import { FC, ReactNode, MouseEvent } from "react";
import { NavLink } from "@mantine/core";

import * as classes from "./RouterNavLink.css";

type RouterNavLinkBaseProps = {
    label: ReactNode,
    description?: ReactNode,
    leftSection?: ReactNode,
    rightSection?: ReactNode,
    disabled?: boolean,
    defaultOpened?: boolean,
};

type RouterNavLinkConditionalProps =
    | {
        children?: ReactNode,
        to?: never,
    }
    | {
        children?: never,
        to?: string | {
            to: string,
            options?: NavigateOptions,
        },
    };

type RouterNavLinkProps = RouterNavLinkBaseProps & RouterNavLinkConditionalProps;

export const RouterNavLink: FC<RouterNavLinkProps> = (props) => {
    const { label, description, leftSection, rightSection, disabled, defaultOpened, children, to } = props;
    const navigate = useNavigate();

    const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (children === undefined && to !== undefined) {
            e.preventDefault();
            if (typeof to === "string") {
                navigate(to);
            } else {
                navigate(to.to, to.options);
            }
        }
    };

    return <NavLink
        classNames={{
            root: classes.root,
        }}
        label={label}
        description={description}
        leftSection={leftSection}
        rightSection={rightSection}
        disabled={disabled}
        defaultOpened={defaultOpened ?? true}
        childrenOffset={children === undefined ? undefined : 28}
        onClick={children === undefined ? onClick : undefined}
    >
        {children}
    </NavLink>;
}