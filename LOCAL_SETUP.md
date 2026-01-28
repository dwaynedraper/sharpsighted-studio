# Setup Instructions for Local Subdomain Testing

## Add to /etc/hosts

Add these lines to your `/etc/hosts` file:

```
127.0.0.1 sharpsighted.local
127.0.0.1 ros.sharpsighted.local
```

## Edit hosts file

```bash
sudo nano /etc/hosts
```

Add the lines above, save, and exit.

## Restart dev server

The dev server should already be running. If not:

```bash
npm run dev
```

## Test the shells

- **Main shell**: http://sharpsighted.local:3001/
- **RoS shell**: http://ros.sharpsighted.local:3001/

Both should render different shells but share theme/accent preferences via cookies.
