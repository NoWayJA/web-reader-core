import ContentPages from "@/web-reader/modules/content-pages/server_components/content-pages";

const SourcesTabs = () => {
    return (
        <div>
            <ContentPages searchParams={{ page: "1" }} />
        </div>
    )
}

export default SourcesTabs;