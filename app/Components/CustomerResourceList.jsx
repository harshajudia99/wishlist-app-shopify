// CustomerResourceList.js
import React, { useState } from 'react';
import { Card, ResourceList, Avatar, ResourceItem, Text } from '@shopify/polaris';
import { getwishlistItem } from '../models/Wishlist.server';
import { useLoaderData } from 'react-router';

export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);
  if (params.id !== "new") {

    const wishlistItem = await getwishlistItem(Number(params.id), admin.graphql);

    return {
      wishlistItem
    };
  }

}

function CustomerResourceList({ customers, onSelectedItemsChange }) {



  const [selectedItems, setSelectedItems] = useState([]);

  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const renderItem = (customer) => {
    const { id, displayName } = customer;
    const media = <Avatar customer size="md" name={displayName} />;

    return (
      <ResourceItem
        id={id}
        media={media}
        accessibilityLabel={`View details for ${displayName}`}
        selected={selectedItems.includes(id)} // Check if the customer is selected
      >
        <Text variant="bodyMd" fontWeight="bold" as="h3">
          {displayName}
        </Text>
        <div>{id}</div>
      </ResourceItem>
    );
  };

  const handleSelectionChange = (selectedItems) => {
    // Ensure only one item is selected
    const lastSelectedItemId = selectedItems[selectedItems.length - 1];
    const selectedCustomer = customers.find((customer) => customer.id === lastSelectedItemId);

    if (selectedCustomer) {
      const selectedDisplayName = selectedCustomer.displayName;
      setSelectedItems([lastSelectedItemId]);

      if (onSelectedItemsChange) {
        onSelectedItemsChange(selectedDisplayName);
      }
    } else {
      setSelectedItems([]);
      if (onSelectedItemsChange) {
        onSelectedItemsChange(null); // or any default value when no item is selected
      }
    }
  };

  const cardTitle =
    selectedItems.length > 0 ? `Select Customers (${selectedItems.length} selected)` : 'Select Customers';

  return (
    <Card title={cardTitle}>
      <ResourceList
        resourceName={resourceName}
        items={customers}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={handleSelectionChange}
        selectable
      />
    </Card>
  );
}

export default CustomerResourceList;
