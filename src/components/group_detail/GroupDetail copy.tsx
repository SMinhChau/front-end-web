import React from "react";
import classNames from "classnames/bind";
import style from "./GroupDetail.module.scss";
import { Select } from "antd";
import type { SelectProps } from "antd";
import { useParams } from "react-router-dom";
const options: SelectProps["options"] = [
  {
    label: "Nguyen Van A",
    value: 1,
  },
  {
    label: "Nguyen Van B",
    value: 2,
  },
  {
    label: "Nguyen Van C",
    value: 4,
  },
  {
    label: "Nguyen Van D",
    value: 5,
  },
  {
    label: "Nguyen Van E",
    value: 6,
  },
];

const cls = classNames.bind(style);

const GroupDetail = () => {


  const { id } = useParams();

  console.log("params id", id);
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  return (
    <div className={cls("group_detail")}>
      <div className={cls("group_name")}>Group 1</div>
      <div className={cls("group_member")}>
        <div className={cls("member")}>
          <span>SV1:</span> Nguyen Van A
        </div>
        <div className={cls("member")}>
          <span>SV2:</span> Tran Thi B
        </div>
      </div>
      <div className={cls("lecturer")}>
        <div>
          <span>Giảng viên hướng dẫn:</span> Nguyen Thi C
        </div>
      </div>
      <div className={cls("topic")}>
        <div className={cls("topic_name")}>
          <span>Đề tài: </span> Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Neque facere cupiditate et beatae iste ex
          consequatur ad assumenda qui vitae eligendi officia illum voluptate
          totam
        </div>
        <div>
          <h3>Yêu cầu đề tài</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae,
            numquam sequi! Harum adipisci expedita incidunt recusandae
            blanditiis excepturi nostrum qui libero quos, veritatis molestias
            nesciunt, animi aliquam tenetur distinctio aperiam maiores at ab,
            iusto ipsum quasi. A eum quo magni tenetur nemo atque iusto ex
            tempora laboriosam at beatae accusantium animi sint, dicta ipsa
            quaerat. Nulla, ipsam sint inventore rem doloribus magni molestiae
            esse vero tempora voluptates. Debitis quasi unde iusto, doloribus
            molestiae vitae impedit aspernatur, dignissimos aut placeat quas
            amet, cum quo cupiditate ipsa quibusdam quod quia eaque? Vero
            provident culpa asperiores nam sequi quae magni aut repudiandae
            amet.
          </p>
        </div>
      </div>
      <div className={cls("counter_argument")}>
        <span>Danh sách giảng viên phản biện đề tài: </span>
        <Select
          mode="tags"
          style={{ width: "50%" }}
          placeholder="Giảng viên"
          onChange={handleChange}
          options={options}
        />
      </div>
      <div className={cls("council")}>
        <span>Danh sách hội đồng: </span>
        <Select
          mode="tags"
          style={{ width: "50%" }}
          placeholder="Giảng viên"
          onChange={handleChange}
          options={options}
        />
      </div>
    </div>
  );
};

export default GroupDetail;
