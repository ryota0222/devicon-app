import { SearchIcon } from "@/components/icons";
import { iconNames } from "@/consts/icons";
import DefaultLayout from "@/layouts/default";
import { Card, Image, Input } from "@nextui-org/react";
import clsx from "clsx";
import "devicon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldExtension } from "microcms-field-extension-react";

const iconKeys = iconNames.map((icon) => Object.keys(icon)[0]);

interface SendMessageData {
  name: string;
  icon: string;
}

export default function IndexPage() {
  const [keyword, setKeyword] = useState("");
  const [selectedKeyList, setSelectedKeyList] = useState<string[]>([]);
  const { data, sendMessage } = useFieldExtension<SendMessageData[] | null>(
    null,
    {
      origin: "https://lazurate-blog.microcms.io",
      height: 300,
      onPostSuccess: (message) => {
        if (message.data.message.title) {
          setSelectedKeyList(message.data.message.title.split(", "));
        }
      },
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
      let list = [...selectedKeyList];
      if (selectedKeyList.includes(key)) {
        list = selectedKeyList.filter((item) => item !== key);
      } else {
        list = [...selectedKeyList, key];
      }
      if (process.env.NODE_ENV === "development") {
        setSelectedKeyList(list);
      } else {
        const data = list.map((item) => {
          const iconPath = getIconPath(item as keyof typeof iconNames);
          return {
            name: item,
            icon: iconPath,
          };
        });
        const title = list.join(", ");
        sendMessage({
          id: "skills",
          title,
          data,
        });
      }
    },
    [sendMessage, getIconPath, selectedKeyList]
  );
  const filteredIconNameList = useMemo(() => {
    if (keyword === "") return iconKeys;
    return iconKeys.filter((element) => element.includes(keyword));
  }, [keyword]);
  useEffect(() => {
    if (data) {
      setSelectedKeyList(data.map((item) => item.name));
    }
  }, [data]);
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="pb-16 w-full">
          {selectedKeyList.length > 0 && (
            <div
              className="p-4 border-b border-slate-400 flex gap-4 items-center justify-center flex-col"
              style={{ marginBottom: "2rem" }}
            >
              <p className="text-sm">選択中のスキル</p>
              <div className="flex flex-wrap">
                {selectedKeyList.map((selectedKey) => (
                  <div
                    key={selectedKey}
                    className="mr-2 flex flex-col items-center gap-1"
                  >
                    <Card
                      disableRipple
                      className={clsx(
                        "w-16 h-16 flex justify-center items-center"
                      )}
                    >
                      <Image
                        src={getIconPath(selectedKey as keyof typeof iconNames)}
                        width={32}
                        height={32}
                        radius="none"
                        alt={selectedKey}
                      />
                    </Card>
                    <span className="text-sm">{selectedKey}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
        <>
          {keyword.length > 0 && filteredIconNameList.length === 0 ? (
            <div className="">
              <p className="text-sm text-center">検索結果がありません</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-8">
              {filteredIconNameList.map((icon) => {
                return (
                  <div
                    key={icon}
                    className="mr-2 flex flex-col items-center gap-1"
                  >
                    <Card
                      isHoverable
                      isPressable
                      disableRipple
                      className={clsx(
                        "w-16 h-16 flex justify-center items-center",
                        selectedKeyList.includes(icon) &&
                          "border-2 border-cyan-500"
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
          )}
        </>
      </section>
    </DefaultLayout>
  );
}
