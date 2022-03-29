#!/bin/bash

output=`docker-compose logs blockchain`

wallets=`echo "$output" | grep -E "\([0-9]+\) 0x[A-Za-z0-9]{40} \(100 ETH\)"  | cut -c 26-`
privates=`echo "$output" | grep -E "\([0-9]+\) 0x[A-Za-z0-9]{64}"  | cut -c 26-`

echo "Available Accounts"
echo "=================="
echo "$wallets"

echo 

echo "Private Keys"
echo "=================="
echo "$privates"