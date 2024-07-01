

const IMAGES_GUANGZHOU = {
  "TotalCount": 2,
  "PageSize": 100,
  "RequestId": "8F32783B-ACBE-5B85-98FB-79A73E02BB6E",
  "PageNumber": 1,
  "Images": {
    "Image": [
      {
        "ImageOwnerAlias": "self",
        "IsSelfShared": "False",
        "Description": "guest os 基础镜像",
        "Platform": "Aliyun",
        "ResourceGroupId": "",
        "Size": 40,
        "IsSubscribed": false,
        "BootMode": "BIOS",
        "OSName": "Alibaba Cloud Linux  3.2104 LTS 64位",
        "IsPublic": false,
        "ImageId": "m-7xv9ien27pg8yukkjwbu",
        "DetectionOptions": {},
        "Features": {
          "NvmeSupport": "supported"
        },
        "OSNameEn": "Alibaba Cloud Linux  3.2104 LTS 64 bit",
        "Tags": {
          "Tag": []
        },
        "LoginAsNonRootSupported": true,
        "Status": "Available",
        "Progress": "100%",
        "Usage": "none",
        "Architecture": "x86_64",
        "ProductCode": "",
        "IsCopied": false,
        "ImageFamily": "",
        "IsSupportIoOptimized": true,
        "IsSupportCloudinit": true,
        "ImageName": "cloud-ops-fvt-linux",
        "DiskDeviceMappings": {
          "DiskDeviceMapping": [
            {
              "SnapshotId": "s-7xv9ien27pg8yuknegpw",
              "Type": "system",
              "Progress": "",
              "Format": "",
              "Device": "/dev/xvda",
              "Size": "40",
              "ImportOSSBucket": "",
              "ImportOSSObject": ""
            }
          ]
        },
        "ImageVersion": "",
        "OSType": "linux",
        "CreationTime": "2023-03-06T06:04:04Z"
      },
      {
        "ImageOwnerAlias": "self",
        "IsSelfShared": "False",
        "Description": "",
        "Platform": "Windows Server 2022",
        "ResourceGroupId": "",
        "Size": 40,
        "IsSubscribed": false,
        "BootMode": "BIOS",
        "OSName": "Windows Server  2022 数据中心版 64位中文版",
        "IsPublic": false,
        "ImageId": "m-7xv39d1mm2md1x9n6mqn",
        "DetectionOptions": {},
        "Features": {
          "NvmeSupport": "unsupported"
        },
        "OSNameEn": "Windows Server  2022 DataCenter Edition 64bit Chinese Edition",
        "Tags": {
          "Tag": []
        },
        "LoginAsNonRootSupported": false,
        "Status": "Available",
        "Progress": "100%",
        "Usage": "none",
        "Architecture": "x86_64",
        "ProductCode": "",
        "IsCopied": false,
        "ImageFamily": "",
        "IsSupportIoOptimized": true,
        "IsSupportCloudinit": true,
        "ImageName": "cloud-ops-fvt-windows",
        "DiskDeviceMappings": {
          "DiskDeviceMapping": [
            {
              "SnapshotId": "s-7xv39d1mm2md1x9qtptv",
              "Type": "system",
              "Progress": "",
              "Format": "",
              "Device": "/dev/xvda",
              "Size": "40",
              "ImportOSSBucket": "",
              "ImportOSSObject": ""
            }
          ]
        },
        "ImageVersion": "",
        "OSType": "windows",
        "CreationTime": "2022-12-22T03:26:34Z"
      }
    ]
  },
  "RegionId": "cn-guangzhou"
}

const EMPTY =  {
  "Images": {
    "Image": []
  },
  "TotalCount": 0,
  "NextToken": "",
  "PageSize": 10,
  "RequestId": "85023B1F-4CC7-5050-A7C0-E25A97CA62FE",
  "PageNumber": 1
}

export const IMAGES: any = {
  default: EMPTY,
  "cn-guangzhou": IMAGES_GUANGZHOU
}
