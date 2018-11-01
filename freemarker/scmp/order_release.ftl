<Transmission>
  <TransmissionHeader>
    <UserName>NCS.INTEGRATION_SCMP</UserName>
    <Password Type="#PasswordDigest">SiymIPzkKmk1cyGDywLaiW9zBIix4bckgtcv3eAQKkI=</Password>
  </TransmissionHeader>
  <TransmissionBody>
    <#list orders as header>
    <GLogXMLElement>
      <Release>
        <ReleaseGid>
          <Gid>
            <DomainName>NCS</DomainName>
            <Xid>${header.ORDER_RELEASE_XID}</Xid>
            <#comment>OR_GID 这是OTM订单GID 需要系统生成 或者调用OTM的ID 规则</#comment>
          </Gid>
        </ReleaseGid>
        <TransactionCode>I</TransactionCode>
        <ReleaseHeader>
          <#comment>APPLY_CODE  申请单号</#comment>
          <ReleaseName>${header.APPLY_CODE}</ReleaseName>
          <ReleaseMethodGid>
            <Gid>
              <DomainName>NCS</DomainName>
              <Xid>SHIP_UNIT</Xid>
            </Gid>
          </ReleaseMethodGid>
          <TimeWindowEmphasisGid>
            <Gid>
              <Xid>PAST</Xid>
            </Gid>
          </TimeWindowEmphasisGid>
          <FlexFieldStrings>
            <Attribute1></Attribute1>
            <#comment>BOX_DETAILS.ISSUE_CODE  发行号，第三层 BOX_DETAILS 中的数据</#comment>
            <Attribute6>${header.ALL_ISSUE_CODES}</Attribute6>
            <Attribute7>${header.ALL_PART_CODES}</Attribute7>
            	<Attribute9>${header.TRAY_TYPE_CODE}</Attribute9>
            <Attribute10></Attribute10>
            <Attribute11></Attribute11>
            <Attribute12>正常配车</Attribute12>
            <Attribute13>${header.SUPPLIER_CODE}</Attribute13>
            <#comment> SUPPLIER_CODE   供应商编码 </#comment>
            <Attribute14>${header.SUPPLIER_NAME}</Attribute14>
            <#comment> 供应商名称  通过 SELECT LOCATION_NAME FROM LOCATION WHERE LOCATION_XID =  'SUPPLIER_CODE' </#comment>
            <Attribute17/>
            <Attribute18>${header.NEED_GOODS_CODE}</Attribute18>
            <#comment> NEED_GOODS_CODE   要货方编码 </#comment>
            <Attribute19>${header.ATTRIBUTE19}</Attribute19>
            <#comment> 根据 SELECT DECODE(ZONE2,'郑州','C2','C1') FROM LOCATION WHERE LOCATION_GID =  '发货地编码 SEND_PLACE_CODE对应的LOCAITON_XID 见 LocationRef' </#comment>
            <Attribute20>${header.ATTRIBUTE20}</Attribute20>
            <#comment> 根据 SELECT ZONE2 FROM LOCATION WHERE LOCATION_GID =  '发货地编码 SEND_PLACE_CODE SEND_PLACE_CODE对应的LOCAITON_XID 见 LocationRef' </#comment>
          </FlexFieldStrings>
          <FlexFieldNumbers>
          <AttributeNumber1>${header.F_SUM?c}</AttributeNumber1>
          <AttributeNumber2>${header.S_SUM?c}</AttributeNumber2>
            <AttributeNumber3>${header.TRAY_LENGTH?c}</AttributeNumber3>
            <AttributeNumber4>${header.TRAY_WIDTH?c}</AttributeNumber4>
            <AttributeNumber5>${header.TRAY_HEIGHT?c}</AttributeNumber5>
            	<AttributeNumber6>${header.BOX_QTY?c}</AttributeNumber6>
              	<AttributeNumber7>${header.QTY?c}</AttributeNumber7>
          </FlexFieldNumbers>
          <#if header.EXPECT_TIME??>
          <FlexFieldDates>
            <AttributeDate1>
              <GLogDate><#if header.EXPECT_TIME??>${header.EXPECT_TIME!}</#if></GLogDate>
              <#comment> EXPECT_TIME 期望取货时间， 格式 yyyyMMddHHmmss 这里要注意，客户时间是29小时制超过24小时需要转换，如 20170510290000 需要转换成 20170509050000</#comment>
              <TZId>Asia/Shanghai</TZId>
              <TZOffset>+08:00</TZOffset>
            </AttributeDate1>
          </FlexFieldDates>
          </#if>
        </ReleaseHeader>
        <ShipFromLocationRef>
          <LocationRef>
            <LocationGid>
              <Gid>
                <DomainName>NCS</DomainName>
                <Xid>${header.SHIP_FROM_LOCATION_XID}</Xid>
                <#comment> 需要转换OTM的ID , SELECT LOCATION_GID FROM LOCATION_REFNUM WHERE LOCATION_REFNUM_QUAL_GID = 'NCS.出货地代码-DFL' AND LOCATION_REFNUM_VALUE = 'SUPPLIER_CODE' || '-' || 'SEND_PLACE_CODE'</#comment>
              </Gid>
            </LocationGid>
          </LocationRef>
        </ShipFromLocationRef>
        <ShipToLocationRef>
          <LocationRef>
            <LocationGid>
              <Gid>
                <DomainName>NCS</DomainName>
                <Xid>${header.NEED_PLACE_CODE}</Xid>
                <#comment> NEED_PLACE_CODE   要货地点编码 select LOCATION_XID from location  where attribute20 = NEED_PLACE_CODE  and  substr(replace(attribute2,'NCS.',''),0,1) = NEED_GOODS_CODE  如果招不到数据 直接使用 NEED_PLACE_CODE</#comment>
              </Gid>
            </LocationGid>
          </LocationRef>
        </ShipToLocationRef>
        <TimeWindow>
          <LateDeliveryDt>
            <GLogDate>${header.details[0].TRAY_ARRI_PLAN_DATE}</GLogDate>
            <#comment> TRAY_DETAILS.TRAY_ARRI_PLAN_DATE 托盘纳期， 格式 yyyyMMddHHmmss 这里要注意，客户时间是29小时制超过24小时需要转换，如 20170510290000 需要转换成 20170509050000</#comment>
            <TZId>Asia/Shanghai</TZId>
            <TZOffset>+08:00</TZOffset>
          </LateDeliveryDt>
        </TimeWindow>
        <ReleaseTypeGid>
          <Gid>
            <DomainName>NCS</DomainName>
            <Xid>部品</Xid>
          </Gid>
        </ReleaseTypeGid>
        <ReleaseLine>
          <#comment>货品明细 (BOX_DETAILS )开始循环，这里一个订单只取一个 BOX_DETAILS 货品明细即可因此编号也是固定单</#comment>
          <ReleaseLineGid>
            <Gid>
              <DomainName>NCS</DomainName>
              <Xid>${header.ORDER_RELEASE_XID}-001</Xid>
              <#comment> 这是OTM订单GID || '-001' </#comment>
            </Gid>
          </ReleaseLineGid>
          <PackagedItemRef>
            <PackagedItem>
              <Packaging>
                <PackagedItemGid>
                  <Gid>
                    <DomainName>NCS</DomainName>
                    <Xid>${header.details[0].PART_CODE}</Xid>
                    <#comment> 货品编码 'NCS.' || BOX_DETAILS.PART_CODE </#comment>
                  </Gid>
                </PackagedItemGid>
              </Packaging>
              <Item>
                <TransactionCode>IU</TransactionCode>
                <ItemGid>
                  <Gid>
                    <Xid>DEFAULT</Xid>
                  </Gid>
                </ItemGid>
              </Item>
            </PackagedItem>
          </PackagedItemRef>
          <ItemQuantity>
            <WeightVolume>
              <Weight>
                <WeightValue>0.0</WeightValue>
                <WeightUOMGid>
                  <Gid>
                    <Xid>LB</Xid>
                  </Gid>
                </WeightUOMGid>
              </Weight>
              <Volume>
                <VolumeValue>0.0</VolumeValue>
                <VolumeUOMGid>
                  <Gid>
                    <Xid>CUFT</Xid>
                  </Gid>
                </VolumeUOMGid>
              </Volume>
            </WeightVolume>
            <PackagedItemCount>1</PackagedItemCount>
          </ItemQuantity>
          <PackagedItemSpecCount>0</PackagedItemSpecCount>
          <FlexFieldStrings>
            <Attribute1>${header.APPLY_CODE}</Attribute1>
            <#comment> APPLY_CODE  申请单号  </#comment>
            <Attribute2/>
            <Attribute3/>
            <Attribute4/>
            <Attribute5>${header.details[0].ISSUE_CODE}</Attribute5>
            <#comment> BOX_DETAILS.ISSUE_CODE  发行号，第三层 BOX_DETAILS 中的数据</#comment>
            <Attribute6>${header.details[0].WORK_ORDER_NO}</Attribute6>
            <#comment> BOX_DETAILS.WORK_ORDER_NO  当工顺，第三层 BOX_DETAILS 中的数据</#comment>
          </FlexFieldStrings>
          <FlexFieldNumbers/>
          <FlexFieldDates>
            <AttributeDate1>
              <GLogDate>${header.details[0].TRAY_ARRI_PLAN_DATE}</GLogDate>
              <#comment> TRAY_DETAILS.TRAY_ARRI_PLAN_DATE 托盘纳期， 格式 yyyyMMddHHmmss 这里要注意，客户时间是29小时制超过24小时需要转换，如 20170510290000 需要转换成 20170509050000</#comment>
              <TZId>Asia/Shanghai</TZId>
              <TZOffset>+08:00</TZOffset>
            </AttributeDate1>
          </FlexFieldDates>
        </ReleaseLine>
        <#list header.details as detail>
          <ShipUnit>
            <#comment> 托盘明细 (TRAY_DETAILS )开始循环，每个TRAY_DETAILS 一行</#comment>
            <ShipUnitGid>
              <Gid>
                <DomainName>NCS</DomainName>
                <Xid>${header.ORDER_RELEASE_XID}-${detail.LINE_NUM}</Xid>
                <#comment>OR_GID OTM订单GID + TRAY_DETAILS 的行号</#comment>
              </Gid>
            </ShipUnitGid>
            <TransactionCode>I</TransactionCode>
            <TransportHandlingUnitRef>
              <ShipUnitSpecRef>
                <ShipUnitSpecGid>
                  <Gid>
                    <DomainName>NCS</DomainName>
                    <Xid><#if detail.TRAY_TYPE_CODE="F">托盘<#else>铁架</#if></Xid>
                    <#comment> 托盘类型 TRAY_DETAILS.TRAY_TYPE_CODE  如果是'F' 返回 '托盘' 如果是'T' 返回 '铁架'</#comment>
                  </Gid>
                </ShipUnitSpecGid>
              </ShipUnitSpecRef>
            </TransportHandlingUnitRef>
            <WeightVolume>
              <Weight>
                <WeightValue>${(detail.TRAY_WEIGHT/1000)?c}</WeightValue>
                <#comment>托重 TRAY_DETAILS.TRAY_WEIGHT</#comment>
                <WeightUOMGid>
                  <Gid>
                    <Xid>KG</Xid>
                  </Gid>
                </WeightUOMGid>
              </Weight>
              <Volume>
                <VolumeValue>${(detail.TRAY_LENGTH * detail.TRAY_WIDTH * detail.TRAY_HEIGHT/1000000000)?c}</VolumeValue>
                <#comment> 体积 TRAY_DETAILS.TRAY_LENGTH * TRAY_DETAILS.TRAY_WIDTH * TRAY_DETAILS.TRAY_HEIGHT </#comment>
                <VolumeUOMGid>
                  <Gid>
                    <Xid>CUMTR</Xid>
                  </Gid>
                </VolumeUOMGid>
              </Volume>
            </WeightVolume>
            <ShipUnitContent>
              <PackagedItemRef>
                <PackagedItem>
                  <Packaging>
                    <PackagedItemGid>
                      <Gid>
                        <DomainName>NCS</DomainName>
                        <Xid>${detail.PART_CODE}</Xid>
                        <#comment> 零件号 'NCS.' || BOX_DETAILS.PART_CODE </#comment>
                      </Gid>
                    </PackagedItemGid>
                  </Packaging>
                  <Item>
                    <TransactionCode>IU</TransactionCode>
                    <ItemGid>
                      <Gid>
                        <Xid>DEFAULT</Xid>
                      </Gid>
                    </ItemGid>
                  </Item>
                </PackagedItem>
              </PackagedItemRef>
              <LineNumber>1</LineNumber>
              <ItemQuantity>
                <IsSplitAllowed>N</IsSplitAllowed>
                <PackagedItemCount>1</PackagedItemCount>
              </ItemQuantity>
              <PackagedItemSpecCount>0</PackagedItemSpecCount>
              <ReleaseGid>
                <Gid>
                  <DomainName>NCS</DomainName>
                  <Xid>${header.ORDER_RELEASE_XID}</Xid>
                  <#comment> OR_GID 这是OTM订单GID 需要系统生成 或者调用OTM的ID 规则 </#comment>
                </Gid>
              </ReleaseGid>
              <ReleaseLineGid>
                <Gid>
                  <DomainName>NCS</DomainName>
                  <Xid>${header.ORDER_RELEASE_XID}-001</Xid>
                  <#comment> OR_GID || '-001' </#comment>
                </Gid>
              </ReleaseLineGid>
            </ShipUnitContent>
            <LengthWidthHeight>
              <Length>
                <LengthValue>${(detail.TRAY_LENGTH/10)?c}</LengthValue>
                <#comment> 托长 TRAY_DETAILS.TRAY_LENGTH </#comment>
                <LengthUOMGid>
                  <Gid>
                    <Xid>CM</Xid>
                  </Gid>
                </LengthUOMGid>
              </Length>
              <Width>
                <WidthValue>${(detail.TRAY_WIDTH/10)?c}</WidthValue>
                <#comment> 托宽 TRAY_DETAILS.TRAY_WIDTH </#comment>
                <WidthUOMGid>
                  <Gid>
                    <Xid>CM</Xid>
                  </Gid>
                </WidthUOMGid>
              </Width>
              <Height>
                <HeightValue>${(detail.TRAY_HEIGHT/10)?c}</HeightValue>
                <#comment> 托高 TRAY_DETAILS.TRAY_HEIGHT </#comment>
                <HeightUOMGid>
                  <Gid>
                    <Xid>CM</Xid>
                  </Gid>
                </HeightUOMGid>
              </Height>
            </LengthWidthHeight>
            <IsSplitAllowed>N</IsSplitAllowed>
            <IsCountSplittable>Y</IsCountSplittable>
            <ShipUnitCount>1</ShipUnitCount>
            <TagInfo>
              <ItemTag1>${detail.TRAY_CODE}</ItemTag1>
              <#comment> 托盘编码 TRAY_DETAILS.TRAY_CODE </#comment>
            </TagInfo>
            <FlexFieldStrings>
              <Attribute1>${header.APPLY_CODE}</Attribute1>
              <#comment> APPLY_CODE  申请单号  </#comment>
              <Attribute2>${detail.ALL_PART_CODES}</Attribute2>
              <#comment> 货品编码 'NCS.' || BOX_DETAILS.PART_CODE </#comment>
              <Attribute3>${detail.TRAY_TYPE_CODE}</Attribute3>
              <#comment> 托盘类型 TRAY_DETAILS.TRAY_TYPE_CODE </#comment>
              <Attribute4>${detail.ALL_ISSUE_CODES}</Attribute4>
              <Attribute6/>
            </FlexFieldStrings>
            <FlexFieldNumbers>
              <AttributeNumber7>${detail.BOX_QTY?c}</AttributeNumber7>
            </FlexFieldNumbers>
            <FlexFieldDates>
              <AttributeDate1>
                <GLogDate>${detail.TRAY_ARRI_PLAN_DATE}</GLogDate>
                <#comment> TRAY_DETAILS.TRAY_ARRI_PLAN_DATE 托盘纳期， 格式 yyyyMMddHHmmss 这里要注意，客户时间是29小时制超过24小时需要转换，如 20170510290000 需要转换成 20170509050000</#comment>
                <TZId>Asia/Shanghai</TZId>
                <TZOffset>+08:00</TZOffset>
              </AttributeDate1>
            </FlexFieldDates>
          </ShipUnit>
          </#list>
      </Release>
    </GLogXMLElement>
    </#list>
  </TransmissionBody>
</Transmission>
