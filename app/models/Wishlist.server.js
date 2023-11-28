import db from "../db.server";


export async function getCustomers(graphql) {
  const response = await graphql(
    `
      query {
        customers(first:5) {
          edges {
            node {
              id
              displayName
            }
          }
        }
      }
    `
  );

  const {
    data: {customers},
  } = await response.json();

  return {
    customers: customers.edges.map(({node}) => node),
  }
}


export async function getAllData(graphql){
  const allData = await db.wishlistItem.findMany({
    orderBy: {id: "desc"}
  })
  if (allData.length === 0) return [];
  return allData;
}

export async function getwishlistItem(id, graphql){
  const wishlistItem = await db.wishlistItem.findFirst({ where:{ id } });
  if (!wishlistItem) {
    return null
  }
  
  return wishlistItem;
}

// export async function getDelete(graphql){
//   await db.wishlistItem.deleteMany()
// }