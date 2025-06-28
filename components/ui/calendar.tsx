"use client";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { IconChevronLgLeft, IconChevronLgRight } from "@intentui/icons";
import {
  type CalendarDate,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import type { CalendarState } from "@react-stately/calendar";
import { use } from "react";
import { CalendarStateContext } from "react-aria-components";
import type {
  CalendarProps as CalendarPrimitiveProps,
  DateValue,
} from "react-aria-components";
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader as CalendarGridHeaderPrimitive,
  CalendarHeaderCell,
  Calendar as CalendarPrimitive,
  Heading,
  Text,
  composeRenderProps,
  useLocale,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

interface CalendarProps<T extends DateValue>
  extends Omit<CalendarPrimitiveProps<T>, "visibleDuration"> {
  errorMessage?: string;
  className?: string;
}

const Calendar = <T extends DateValue>({
  errorMessage,
  className,
  ...props
}: CalendarProps<T>) => {
  const now = today(getLocalTimeZone());

  return (
    <CalendarPrimitive {...props}>
      <CalendarHeader />
      <CalendarGrid className="[&_td]:border-collapse [&_td]:px-0 [&_td]:py-0.5">
        <CalendarGridHeader />
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className={composeRenderProps(
                className,
                (className, { isSelected, isDisabled }) =>
                  twMerge(
                    "text-fg hover:bg-secondary-fg/15 relative flex size-10 cursor-default items-center justify-center rounded-lg tabular-nums outline-hidden sm:size-9 sm:text-sm/6 forced-colors:text-[ButtonText] forced-colors:outline-0",
                    isSelected &&
                      "bg-primary pressed:bg-primary text-primary-fg hover:bg-primary/90 data-invalid:bg-danger data-invalid:text-danger-fg forced-colors:bg-[Highlight] forced-colors:text-[Highlight] forced-colors:data-invalid:bg-[Mark]",
                    isDisabled && "text-muted-fg forced-colors:text-[GrayText]",
                    date.compare(now as any) === 0 &&
                      "after:bg-primary selected:after:bg-primary-fg focus-visible:after:bg-primary-fg after:pointer-events-none after:absolute after:start-1/2 after:bottom-1 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full",
                    className,
                  ),
              )}
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text slot="errorMessage" className="text-danger text-sm/6">
          {errorMessage}
        </Text>
      )}
    </CalendarPrimitive>
  );
};

const CalendarHeader = ({
  isRange,
  className,
  ...props
}: React.ComponentProps<"header"> & { isRange?: boolean }) => {
  const { direction } = useLocale();
  const state = use(CalendarStateContext)!;

  return (
    <header
      data-slot="calendar-header"
      className={twMerge(
        "flex w-full justify-center gap-1.5 pt-1 pr-1 pb-5 pl-1.5 sm:pb-4",
        className,
      )}
      {...props}
    >
      {!isRange && (
        <>
          <SelectMonth state={state as any} />
          <SelectYear state={state as any} />
        </>
      )}
      <Heading
        className={twMerge(
          "text-muted-fg mr-2 flex-1 text-left font-medium sm:text-sm",
          !isRange && "sr-only",
          className,
        )}
      />
      <div className="flex items-center gap-1">
        <Button
          size="square-petite"
          className="**:data-[slot=icon]:text-fg size-8 sm:size-7"
          shape="circle"
          intent="plain"
          slot="previous"
        >
          {direction === "rtl" ? <IconChevronLgRight /> : <IconChevronLgLeft />}
        </Button>
        <Button
          size="square-petite"
          className="**:data-[slot=icon]:text-fg size-8 sm:size-7"
          shape="circle"
          intent="plain"
          slot="next"
        >
          {direction === "rtl" ? <IconChevronLgLeft /> : <IconChevronLgRight />}
        </Button>
      </div>
    </header>
  );
};

const SelectMonth = ({ state }: { state: CalendarState }) => {
  const months = [];

  const formatter = useDateFormatter({
    month: "long",
    timeZone: state.timeZone,
  });

  const numMonths = state.focusedDate.calendar.getMonthsInYear(
    state.focusedDate,
  );
  for (let i = 1; i <= numMonths; i++) {
    const date = state.focusedDate.set({ month: i });
    months.push(formatter.format(date.toDate(state.timeZone)));
  }
  return (
    <Select
      className="[popover-width:8rem]"
      aria-label="Select month"
      selectedKey={
        state.focusedDate.month.toString() ??
        (new Date().getMonth() + 1).toString()
      }
      onSelectionChange={(value) => {
        state.setFocusedDate(state.focusedDate.set({ month: Number(value) }));
      }}
    >
      <Select.Trigger className="h-8 w-22 text-xs group-data-open:ring-3 focus:ring-3 **:data-[slot=select-value]:inline-block **:data-[slot=select-value]:truncate" />
      <Select.List
        className="w-34 max-w-34 min-w-34"
        popoverClassName="w-34 max-w-34 min-w-34"
      >
        {months.map((month, index) => (
          <Select.Option
            key={index}
            id={(index + 1).toString()}
            textValue={month}
          >
            <Select.Label>{month}</Select.Label>
          </Select.Option>
        ))}
      </Select.List>
    </Select>
  );
};

const SelectYear = ({ state }: { state: CalendarState }) => {
  const years: { value: CalendarDate; formatted: string }[] = [];
  const formatter = useDateFormatter({
    year: "numeric",
    timeZone: state.timeZone,
  });

  for (let i = -20; i <= 20; i++) {
    const date = state.focusedDate.add({ years: i });

    // Only add the date if it's within the min/max range
    const isAfterMin = !state.minValue || date.compare(state.minValue) >= 0;
    const isBeforeMax = !state.maxValue || date.compare(state.maxValue) <= 0;

    if (isAfterMin && isBeforeMax) {
      years.push({
        value: date,
        formatted: formatter.format(date.toDate(state.timeZone)),
      });
    }
  }

  return (
    <Select
      aria-label="Select year"
      selectedKey={years.findIndex((y) => y.value.compare(state.focusedDate) === 0)}
      onSelectionChange={(value) => {
        const index = Number(value);
        if (!isNaN(index) && years[index]) {
          state.setFocusedDate(years[index].value);
        }
      }}
    >
      <Select.Trigger className="h-8 text-xs group-data-open:ring-3 focus:ring-3" />
      <Select.List
        className="w-34 max-w-34 min-w-34"
        popoverClassName="w-34 max-w-34 min-w-34"
      >
        {years.map((year, i) => (
          <Select.Option key={i} id={i} textValue={year.formatted}>
            <Select.Label>{year.formatted}</Select.Label>
          </Select.Option>
        ))}
      </Select.List>
    </Select>
  );
};


const CalendarGridHeader = () => {
  return (
    <CalendarGridHeaderPrimitive>
      {(day) => (
        <CalendarHeaderCell className="text-muted-fg pb-2 text-sm font-semibold sm:px-0 sm:py-0.5 lg:text-xs">
          {day}
        </CalendarHeaderCell>
      )}
    </CalendarGridHeaderPrimitive>
  );
};

export type { CalendarProps };
export { Calendar, CalendarHeader, CalendarGridHeader };
