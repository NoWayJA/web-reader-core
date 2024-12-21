import Queue from "@/web-reader/modules/queue/server_components/queue";

const QueueTabs = () => {
    return (
        <div>
            <Queue searchParams={{ page: "1" }} />
        </div>
    )
}

export default QueueTabs;