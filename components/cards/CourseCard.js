import { Card, Badge, Tooltip } from "antd";
import Link from "next/link";
import { SnippetsOutlined } from '@ant-design/icons';

const { Meta } = Card;

const CourseCard = ({ course }) => {
    // destructure
    const { name, instructor, image, slug, category, published } = course;
    console.log(category);
    return (
        <Link href="/course/[slug]" as={`/course/${slug}`}>
            <a>
                <Card
                    hoverable="true"
                    className="mb-4"
                    cover={
                        <img
                            src={image.Location}
                            alt={name}
                            style={{ height: "200px", objectFit: "cover" }}
                            className="p-1"
                        />
                    }
                >
                    <h2 className="h4 font-weight-bold">{name}</h2>
                    <p>by {instructor.name}</p>
                    <p>{published}</p>



                    <Badge
                        count={category}
                        style={{ backgroundColor: '#03a9f4' }}
                        className="pb-2 mr-2"
                    />
                </Card>
            </a>
        </Link >
    );
};

export default CourseCard;
