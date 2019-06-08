# service-catalogue

## Prerequisites
- Ensure youre connect to the VPN
- Kubernetes credentials should be saved in `~/.kube./config` (non-prod in this case)

## Starting the service
- install dependencies using `npm i`
- `npm run start`
- visit ` http://localhost:4000` this opens up the graphQl playground
- begin writting queries 

## How it works?
Essentially this service is a graphQL server which has kubernetes non prod data and the service catalogue as data sources. (`./dataSources`)

For each piece of information you wish to be returned from the dataSources a "resolver" for the information must be created(`./resolvers`). How data is resolved.

Types is effectively the graphQl schema where relationships are definied. This is where the data stitching happens for example you can have a Service (this is from service catalogue) which has podInfo (this is from the kubernetes data souce).(`./types`)

## Example queries
Getting a list of all names for all services
```
query {
  services {
    name
  }
}
```

Querying a service which has a name of "rewards.broker" and depliying its name and owner
```
query {
  service (name: "rewards.broker") {
    name
    owner
  }
}
```
