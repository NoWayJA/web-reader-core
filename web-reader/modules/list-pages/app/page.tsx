import ListPages from "@/web-reader/modules/list-pages/server_components/list-pages";

const SourcesTabs = () => {
    return (
        <div>
            <ListPages searchParams={{ page: "1" }} />
        </div>
    )
}

export default SourcesTabs;