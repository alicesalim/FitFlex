import style from "./title_esq.module.css";

export default function TitleEsq({ title }) {
    return (
        <div className={style.container}>
            <h1 className={style.title}>{title}</h1>
            <hr className={style.linha} />
        </div>
    );
}
