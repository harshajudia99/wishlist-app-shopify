import React, { useState } from 'react';
import { BlockStack, Button, Card, InlineStack, Layout, Page, PageActions, Text, Thumbnail } from '@shopify/polaris';
import { getCustomers, getwishlistItem } from '../models/Wishlist.server';
import { authenticate } from '../shopify.server';
import { useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import CustomerResourceList from '../Components/CustomerResourceList';
import { ImageMajor } from "@shopify/polaris-icons";
import db from "../db.server";
import { json, redirect } from '@remix-run/node';


export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);
  const customers = await getCustomers(admin.graphql);

  return {
    customers,
  };


}

export async function action({ request, params }) {

  const { session } = await authenticate.admin(request)
  // const {shop} = session;

  const data = {
    ...Object.fromEntries(await request.formData()),
  }

  console.log(data, 'data2')
  data.productCount = parseInt(data.productCount)

  const newData = await db.wishlistItem.create({ data })

  return redirect("/app")

}


export default function WishlistForm() {
  const { customers } = useLoaderData();

  const navigate = useNavigate()

  console.log(customers)

  const [formState, setFormState] = useState({
    productsName: [],
  });

  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectedItemsChange = (items) => {
    setSelectedItems(items);
  };

  async function selectProducts() {
    const products = await window.shopify.resourcePicker({
      type: 'product',
      action: 'select',
      multiple: true,
    });

    if (products) {
      const updatedProducts = products.map((product) => {
        const { images, id, title } = product;
        return {
          productImage: images[0]?.originalSrc,
          productAlt: images[0]?.altText,
          productTitle: title,
          productId: id
        };
      });
      setFormState({ productsName: updatedProducts });
    }

  }

  const submit = useSubmit();

  function handleSave() {
    const productTitle = formState.productsName.map((product) => product.productTitle);
    const productImage = formState.productsName.map((product) => product.productImage);
    const productAlt = formState.productsName.map((product) => product.productAlt);
    const productId = formState.productsName.map((product) => product.productId);
    const productCount = productTitle.length;

    console.log(productTitle)

    console.log("Type of productCount:", typeof productCount);

    const data = {
      productTitle: productTitle,
      customerName: selectedItems,
      productId: productId,
      productCount: productCount,
      productImage: productImage,
      productAlt: productAlt,
    };

    console.log(data);
    submit(data, { method: "post" });
  }

  function handleCancel() {
    navigate("/app")
  }

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">


              <InlineStack align="space-between">
                <Text as={'h2'} variant="headingLg">
                  Product
                </Text>
                {formState.productsName.length > 0 && (
                  <Button variant="plain" onClick={selectProducts}>
                    Change products
                  </Button>
                )}
              </InlineStack>
              {formState.productsName.length > 0 &&
                formState.productsName.map((product, index) => (
                  <InlineStack key={index} blockAlign="center" gap="500">
                    <Thumbnail
                      source={product.productImage || ImageMajor}
                      alt={product.productAlt}
                    />
                    <Text
                      as="span"
                      variant="headingMd"
                      fontWeight="semibold"
                    >
                      {product.productTitle}
                    </Text>
                  </InlineStack>
                ))}

              {formState.productsName.length === 0 && (
                <BlockStack gap="200">
                  <Button onClick={selectProducts} id="select-product">
                    Select products
                  </Button>
                  {/* {errors.productId ? (
                    <InlineError
                      message={errors.productId}
                      fieldID="myFieldID"
                    />
                  ) : null} */}
                </BlockStack>

              )}

            </BlockStack>
          </Card>
          <CustomerResourceList customers={customers.customers} onSelectedItemsChange={handleSelectedItemsChange} />

        </Layout.Section>

        <Layout.Section>
          <PageActions
            secondaryActions={[
              {
                content: "Cancel",
                // loading: isDeleting,
                // disabled: !qrCode.id || !qrCode || isSaving || isDeleting,
                destructive: true,
                outline: true,
                onAction: handleCancel,
              },
            ]}
            primaryAction={{
              content: "Save",
              // loading: isSaving,
              // disabled: !isDirty || isSaving || isDeleting,
              onAction: handleSave,
            }}
          />
        </Layout.Section>


      </Layout>
    </Page>
  );
}