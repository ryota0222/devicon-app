import { SearchIcon } from "@/components/icons";
import { iconNames } from "@/consts/icons";
import DefaultLayout from "@/layouts/default";
import { Card, Image, Input } from "@nextui-org/react";
import clsx from "clsx";
import "devicon";
import { useCallback, useMemo, useState } from "react";
import { useFieldExtension } from "microcms-field-extension-react";

const iconKeys = iconNames.map((icon) => Object.keys(icon)[0]);

interface SendMessageData {
  name: string;
  icon: string;
}

export default function IndexPage() {
  const [keyword, setKeyword] = useState("");
  const [selectedKey, setSelectedKey] = useState<string>("");
  const { data, sendMessage } = useFieldExtension<SendMessageData | null>(
    null,
    {
      origin: "https://lazurate-blog.microcms.io",
      height: 300,
    }
  );
  const getIconPath = useCallback((key: keyof typeof iconNames) => {
    // eslint-disable-next-line
    const iconObj = iconNames.find(
      (icon: any) => icon[key] !== undefined
    ) as any;
    const icon = iconObj?.[key];
    // 末尾
    let last = "";
    if (icon) {
      // original-wordmarkとついたsvgファイルがある場合
      if (icon.includes(`${key as string}-original-wordmark`)) {
        last = "-original-wordmark";
      }
      // 末尾がoriginalの場合
      if (icon.includes(`${key as string}-original`)) {
        last = "-original";
      }
      if (last === "") {
        if (icon.includes(`${key as string}-plain`)) {
          last = "-plain";
        } else if (icon.includes(`${key as string}-line`)) {
          last = "-line";
        }
      }
    }
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${
      key as string
    }/${key as string}${last}.svg`;
  }, []);
  const handleClickIcon = useCallback(
    (key: string) => {
      setSelectedKey(key);
      const iconPath = getIconPath(key as keyof typeof iconNames);
      sendMessage({
        id: "skill",
        title: key,
        // imageUrl: iconPath,
        data: {
          name: key,
          icon: iconPath,
        },
      });
    },
    [sendMessage, getIconPath]
  );
  const filteredIconNameList = useMemo(() => {
    if (keyword === "") return iconKeys;
    return iconKeys.filter((element) => element.includes(keyword));
  }, [keyword]);
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="pb-16 w-full">
          <Input
            aria-label="Search"
            classNames={{
              inputWrapper: "bg-default-100 max-w-xl mx-auto",
              input: "text-sm",
            }}
            labelPlacement="outside"
            placeholder="Search..."
            startContent={
              <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
            }
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 gap-8">
          {filteredIconNameList.map((icon) => {
            return (
              <div key={icon} className="mr-2 flex flex-col items-center gap-1">
                <Card
                  isHoverable
                  isPressable
                  disableRipple
                  className={clsx(
                    "w-16 h-16 flex justify-center items-center",
                    selectedKey.includes(icon) && "border-2 border-cyan-500"
                  )}
                  onClick={() => handleClickIcon(icon)}
                >
                  <Image
                    src={getIconPath(icon as keyof typeof iconNames)}
                    width={32}
                    height={32}
                    radius="none"
                    alt={icon}
                  />
                </Card>
                <span className="text-sm">{icon}</span>
              </div>
            );
          })}
        </div>
      </section>
    </DefaultLayout>
  );
}
