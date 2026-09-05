async def main(ns):
    print("Hello World")

def getAllServers(ns):
    serverList = []
    serversToScan = ["home"]
    while len(serversToScan) > 0:
        server = serversToScan.pop()
        if server not in serverList:
            
            serverList.append(server)
            serversToScan += ns.scan(server)
    return serverList