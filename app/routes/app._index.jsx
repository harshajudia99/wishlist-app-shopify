import { useLoaderData, useNavigate, Link } from "@remix-run/react";
import { Card, EmptyState, IndexTable, Layout, Page } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { getAllData, getDelete } from "../models/Wishlist.server";
import { json } from "@remix-run/node";


export async function loader ({request}) {
  const {admin} = await authenticate.admin(request);
  const allData = await getAllData(admin.graphql)
  // await getDelete(admin.graphql)
  return json({allData});
}

const EmptyWishlist = ({ onAction }) => (
  <EmptyState
    heading="Create a wishlist"
    action={{
      content: "Add product",
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
  </EmptyState>
);

function truncate(str, { length = 25 } = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

const WishlistTable = ({allData}) => (
  <IndexTable
    resourceName={{
      singular: "Wislist",
      plural: "Wislists",
    }}
    itemCount={allData.length}
    headings={[
      { title: "Customer Name" },
      { title: "Product Title" },
      { title: "Product Count" },
      { title: "Date created" },
    ]}
    selectable={false}
  >
    {allData.map((data) => (
      <WishlistRow key={data.id} data={data} />
    ))}
  </IndexTable>
)

const WishlistRow = ({data}) => (
  <IndexTable.Row id={data.id} position={data.id}>
    <IndexTable.Cell><Link to={`wishlistupdate/${data.id}`}>{data.customerName}</Link></IndexTable.Cell>
    <IndexTable.Cell>{truncate(data.productTitle)}</IndexTable.Cell>
    <IndexTable.Cell>{data.productCount}</IndexTable.Cell>
    <IndexTable.Cell>
      {new Date(data.createdAt).toDateString()}
    </IndexTable.Cell>
  </IndexTable.Row>
)

export default function Index() {

  const navigate = useNavigate()
  const {allData} = useLoaderData()
  console.log(allData)

  return (
    <Page>
      <ui-title-bar title="Wishlist">
      <button variant="primary" onClick={() => navigate("/app/wishlist/new")}>
          Add product
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {allData.length === 0 ? (
              <EmptyWishlist onAction={() => navigate("wishlist/new")} />
            ) : (
              <WishlistTable allData={allData} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
