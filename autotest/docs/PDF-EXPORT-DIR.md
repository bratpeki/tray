# CUPS-PDF

In `/etc/cups/cups-pdf.conf`, there's this:

```
### Key: Out (config)
##  CUPS-PDF output directory
##  special qualifiers:
##     ${HOME} will be expanded to the user's home directory
##     ${USER} will be expanded to the user name
##  in case it is an NFS export make sure it is exported without
##  root_squash!
### Default: /var/spool/cups-pdf/${USER}

#Out /var/spool/cups-pdf/${USER}
```

So the confirmed directory is that.

In Node, you can get the OS username from `require("os").userInfo().username`
([ref](https://stackoverflow.com/questions/40424298/how-to-get-os-username-in-nodejs)).
